class Ruangan extends Model
{
    use HasFactory;
    protected $table = 'ruangan';
    protected $primaryKey = 'ruangan_id';
    public $timestamps = false; // Tanpa created_at/updated_at
    protected $fillable = ['nama_ruangan', 'kapasitas', 'lokasi', 'keterangan'];
}